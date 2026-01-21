#!/usr/bin/env python3
"""
KMHFL/KMHFR Facilities Data Extractor

This script extracts the full facility dataset from the Kenya Master Health Facility List (KMHFL)
public website and saves it to an Excel file.

The script uses the KMHFL public website's data endpoints to extract facility information.
It dynamically discovers the Next.js build ID and uses internal data endpoints for pagination.

Usage:
    python facilities_to_excel.py --out kmhfr_facilities.xlsx
"""

import argparse
import logging
import os
import re
import sys  
import time
import urllib3
from typing import Any, Optional
from urllib.parse import parse_qs, urlencode, urlparse

import certifi
import pandas as pd
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Fix certificate path issue on Windows
os.environ['SSL_CERT_FILE'] = certifi.where()
os.environ['REQUESTS_CA_BUNDLE'] = certifi.where()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

# KMHFL website URL
KMHFL_BASE_URL = "https://kmhfl.health.go.ke"
KMHFL_PUBLIC_FACILITIES_URL = f"{KMHFL_BASE_URL}/public/facilities"

# Backend API (may require auth or have issues)
API_BASE_URL = "https://api.kmhfr.health.go.ke"
API_FACILITIES_ENDPOINT = "/api/facilities/facilities/"


def create_session_with_retries(
    retries: int = 3,
    backoff_factor: float = 0.5,
    status_forcelist: tuple = (502, 503, 504),
    verify_ssl: bool = True,
) -> requests.Session:
    """
    Create a requests session with automatic retry logic.
    
    Args:
        retries: Number of retries for failed requests
        backoff_factor: Backoff factor for retry delays
        status_forcelist: HTTP status codes to retry on
        verify_ssl: Whether to verify SSL certificates
    
    Returns:
        Configured requests.Session object
    """
    session = requests.Session()
    session.verify = verify_ssl
    
    if not verify_ssl:
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    
    retry_strategy = Retry(
        total=retries,
        backoff_factor=backoff_factor,
        status_forcelist=status_forcelist,
        allowed_methods=["GET"],
    )
    
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    
    # Add browser-like headers
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
    })
    
    return session


def get_nextjs_build_id(session: requests.Session, timeout: int = 30) -> Optional[str]:
    """
    Extract the Next.js build ID from the KMHFL website.
    
    The build ID is needed to construct _next/data URLs for server-side data.
    
    Args:
        session: Requests session to use
        timeout: Request timeout in seconds
    
    Returns:
        Build ID string or None if not found
    """
    try:
        logger.info("Fetching KMHFL website to discover build ID...")
        response = session.get(KMHFL_PUBLIC_FACILITIES_URL, timeout=timeout)
        response.raise_for_status()
        
        # Look for build ID in the HTML (it's in script tags)
        # Pattern: /_next/static/BUILD_ID/_buildManifest.js
        html = response.text
        
        patterns = [
            r'/_next/static/([a-zA-Z0-9_-]+)/_buildManifest\.js',
            r'"buildId":"([a-zA-Z0-9_-]+)"',
            r'/_next/data/([a-zA-Z0-9_-]+)/',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, html)
            if match:
                build_id = match.group(1)
                logger.info(f"Found Next.js build ID: {build_id}")
                return build_id
        
        logger.warning("Could not find Next.js build ID in page source")
        return None
        
    except Exception as e:
        logger.error(f"Error fetching website: {e}")
        return None


def fetch_initial_page_data(
    session: requests.Session,
    build_id: str,
    timeout: int = 60,
) -> Optional[dict]:
    """
    Fetch the initial facilities page data using Next.js data endpoint.
    
    Args:
        session: Requests session to use
        build_id: Next.js build ID
        timeout: Request timeout in seconds
    
    Returns:
        Page data dictionary or None on failure
    """
    data_url = f"{KMHFL_BASE_URL}/_next/data/{build_id}/public/facilities.json"
    
    try:
        logger.info(f"Fetching initial page data from: {data_url}")
        response = session.get(data_url, timeout=timeout)
        response.raise_for_status()
        
        data = response.json()
        return data.get("pageProps", {}).get("data", {})
        
    except Exception as e:
        logger.error(f"Error fetching initial page data: {e}")
        return None


def fetch_api_page(
    session: requests.Session,
    url: str,
    timeout: int = 60,
) -> Optional[dict]:
    """
    Fetch a page from the backend API.
    
    Args:
        session: Requests session to use
        url: Full URL with query parameters
        timeout: Request timeout in seconds
    
    Returns:
        API response dictionary or None on failure
    """
    try:
        response = session.get(url, timeout=timeout)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as e:
        logger.warning(f"HTTP error fetching {url}: {e}")
        return None
    except Exception as e:
        logger.warning(f"Error fetching {url}: {e}")
        return None


def fetch_all_facilities_via_nextjs(
    session: requests.Session,
    build_id: str,
    sleep_seconds: float = 0.2,
    max_pages: Optional[int] = None,
    timeout: int = 60,
) -> list[dict]:
    """
    Fetch all facilities using the Next.js server-side data endpoints and backend API.
    
    This method first gets the initial page from Next.js, then follows pagination
    URLs from the backend API.
    
    Args:
        session: Requests session to use
        build_id: Next.js build ID
        sleep_seconds: Sleep time between requests
        max_pages: Maximum pages to fetch (None for all)
        timeout: Request timeout in seconds
    
    Returns:
        List of all facility records
    """
    all_facilities = []
    
    # Get initial page from Next.js
    initial_data = fetch_initial_page_data(session, build_id, timeout)
    
    if not initial_data:
        logger.error("Failed to fetch initial page data")
        return all_facilities
    
    total_count = initial_data.get("count", 0)
    results = initial_data.get("results", [])
    next_url = initial_data.get("next")
    
    all_facilities.extend(results)
    logger.info(f"Page 1: fetched {len(results)} records (total so far: {len(all_facilities)}, API total: {total_count})")
    
    page = 1
    
    # Continue fetching from backend API using next URLs
    while next_url and (max_pages is None or page < max_pages):
        page += 1
        time.sleep(sleep_seconds)
        
        logger.info(f"Fetching page {page}...")
        
        page_data = fetch_api_page(session, next_url, timeout)
        
        if not page_data:
            logger.warning(f"Failed to fetch page {page}, stopping pagination")
            break
        
        results = page_data.get("results", [])
        next_url = page_data.get("next")
        
        all_facilities.extend(results)
        logger.info(f"Page {page}: fetched {len(results)} records (total so far: {len(all_facilities)}, API total: {total_count})")
    
    return all_facilities


def fetch_all_facilities_via_pages(
    session: requests.Session,
    build_id: str,
    sleep_seconds: float = 0.2,
    max_pages: Optional[int] = None,
    timeout: int = 60,
) -> list[dict]:
    """
    Fetch all facilities by iterating through page numbers in Next.js data endpoints.
    
    This is a fallback method if the backend API pagination URLs don't work.
    
    Args:
        session: Requests session to use
        build_id: Next.js build ID
        sleep_seconds: Sleep time between requests
        max_pages: Maximum pages to fetch (None for all)
        timeout: Request timeout in seconds
    
    Returns:
        List of all facility records
    """
    all_facilities = []
    page = 1
    total_pages = None
    
    while True:
        if max_pages and page > max_pages:
            break
        
        # Construct URL with page parameter
        if page == 1:
            data_url = f"{KMHFL_BASE_URL}/_next/data/{build_id}/public/facilities.json"
        else:
            data_url = f"{KMHFL_BASE_URL}/_next/data/{build_id}/public/facilities.json?page={page}"
        
        try:
            logger.info(f"Fetching page {page}...")
            response = session.get(data_url, timeout=timeout)
            
            if response.status_code == 404:
                # Build ID may have changed, try to get new one
                logger.warning("Got 404, build ID may have changed")
                break
            
            response.raise_for_status()
            data = response.json()
            page_data = data.get("pageProps", {}).get("data", {})
            
            if not page_data:
                logger.warning(f"No data in page {page} response")
                break
            
            results = page_data.get("results", [])
            total_count = page_data.get("count", 0)
            current_total_pages = page_data.get("total_pages", 1)
            
            if total_pages is None:
                total_pages = current_total_pages
                logger.info(f"Total pages: {total_pages}, Total records: {total_count}")
            
            if not results:
                logger.info(f"No more results at page {page}")
                break
            
            all_facilities.extend(results)
            logger.info(f"Page {page}/{total_pages}: fetched {len(results)} records (total so far: {len(all_facilities)})")
            
            if page >= total_pages:
                break
            
            page += 1
            time.sleep(sleep_seconds)
            
        except requests.exceptions.HTTPError as e:
            logger.error(f"HTTP error on page {page}: {e}")
            break
        except Exception as e:
            logger.error(f"Error on page {page}: {e}")
            break
    
    return all_facilities


def fetch_all_facilities(
    session: requests.Session,
    sleep_seconds: float = 0.2,
    max_pages: Optional[int] = None,
    timeout: int = 60,
) -> list[dict]:
    """
    Main function to fetch all facilities using the best available method.
    
    Tries multiple approaches:
    1. Next.js data endpoint with backend API pagination
    2. Next.js data endpoint with page number iteration
    
    Args:
        session: Requests session to use
        sleep_seconds: Sleep time between requests
        max_pages: Maximum pages to fetch (None for all)
        timeout: Request timeout in seconds
    
    Returns:
        List of all facility records
    """
    # First, get the Next.js build ID
    build_id = get_nextjs_build_id(session, timeout)
    
    if not build_id:
        logger.error("Could not determine Next.js build ID. Cannot proceed.")
        return []
    
    # Try fetching via Next.js + backend API pagination
    logger.info("Attempting to fetch facilities via Next.js + API pagination...")
    facilities = fetch_all_facilities_via_nextjs(
        session, build_id, sleep_seconds, max_pages, timeout
    )
    
    # If we got very few results, try the page iteration method
    if len(facilities) < 100:
        logger.info("Trying alternative page iteration method...")
        facilities = fetch_all_facilities_via_pages(
            session, build_id, sleep_seconds, max_pages, timeout
        )
    
    return facilities


def flatten_facilities_data(facilities: list[dict]) -> pd.DataFrame:
    """
    Flatten nested JSON data into a pandas DataFrame.
    
    Args:
        facilities: List of facility records
    
    Returns:
        Flattened DataFrame
    """
    if not facilities:
        logger.warning("No facilities data to flatten")
        return pd.DataFrame()
    
    logger.info(f"Flattening {len(facilities)} facility records...")
    
    # Use json_normalize to flatten nested structures
    df = pd.json_normalize(facilities, sep=".")
    
    # Reorder columns to put important ones first
    priority_columns = [
        'id', 'code', 'name', 'facility_type_name', 'owner_name',
        'county', 'constituency', 'ward_name', 'keph_level_name',
        'operation_status_name', 'regulatory_status_name'
    ]
    
    # Get columns that exist in the DataFrame
    existing_priority = [col for col in priority_columns if col in df.columns]
    other_columns = [col for col in df.columns if col not in priority_columns]
    
    # Reorder
    df = df[existing_priority + other_columns]
    
    logger.info(f"Created DataFrame with {len(df)} rows and {len(df.columns)} columns")
    
    return df


def save_to_excel(df: pd.DataFrame, output_path: str, sheet_name: str = "Facilities") -> None:
    """
    Save DataFrame to Excel file.
    
    Args:
        df: DataFrame to save
        output_path: Output file path
        sheet_name: Name of the Excel sheet
    """
    if df.empty:
        logger.warning("DataFrame is empty. Creating Excel file with headers only.")
    
    logger.info(f"Saving to Excel: {output_path}")
    
    # Use openpyxl engine for .xlsx files
    with pd.ExcelWriter(output_path, engine="openpyxl") as writer:
        df.to_excel(writer, sheet_name=sheet_name, index=False)
        
        # Auto-adjust column widths
        worksheet = writer.sheets[sheet_name]
        for idx, col in enumerate(df.columns):
            max_length = max(
                df[col].astype(str).map(len).max() if len(df) > 0 else 0,
                len(str(col))
            )
            # Limit to reasonable width
            adjusted_width = min(max_length + 2, 50)
            worksheet.column_dimensions[chr(65 + idx) if idx < 26 else f"{chr(64 + idx // 26)}{chr(65 + idx % 26)}"].width = adjusted_width
    
    logger.info(f"Successfully saved {len(df)} records to {output_path}")


def parse_arguments() -> argparse.Namespace:
    """
    Parse command line arguments.
    
    Returns:
        Parsed arguments namespace
    """
    parser = argparse.ArgumentParser(
        description="Extract KMHFL/KMHFR facilities data to Excel",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python facilities_to_excel.py
  python facilities_to_excel.py --out my_facilities.xlsx
  python facilities_to_excel.py --max-pages 10  # Limit to 10 pages for testing
  python facilities_to_excel.py --sleep 0.5     # Slower requests
  python facilities_to_excel.py --no-verify-ssl # Disable SSL verification
        """,
    )
    
    parser.add_argument(
        "--out",
        default="kmhfr_facilities.xlsx",
        help="Output Excel file path (default: kmhfr_facilities.xlsx)",
    )
    
    parser.add_argument(
        "--sleep",
        type=float,
        default=0.2,
        help="Sleep time between API requests in seconds (default: 0.2)",
    )
    
    parser.add_argument(
        "--max-pages",
        type=int,
        default=None,
        help="Maximum number of pages to fetch (default: all)",
    )
    
    parser.add_argument(
        "--timeout",
        type=int,
        default=60,
        help="Request timeout in seconds (default: 60)",
    )
    
    parser.add_argument(
        "--retries",
        type=int,
        default=3,
        help="Number of retries for failed requests (default: 3)",
    )
    
    parser.add_argument(
        "--no-verify-ssl",
        action="store_true",
        help="Disable SSL certificate verification (use with caution)",
    )
    
    parser.add_argument(
        "-v", "--verbose",
        action="store_true",
        help="Enable verbose/debug logging",
    )
    
    return parser.parse_args()


def main() -> int:
    """
    Main entry point for the script.
    
    Returns:
        Exit code (0 for success, 1 for failure)
    """
    args = parse_arguments()
    
    # Set logging level
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    logger.info("=" * 60)
    logger.info("KMHFL/KMHFR Facilities Data Extractor")
    logger.info("=" * 60)
    logger.info(f"Target: {KMHFL_PUBLIC_FACILITIES_URL}")
    
    # Create session with retry logic
    verify_ssl = not args.no_verify_ssl
    session = create_session_with_retries(retries=args.retries, verify_ssl=verify_ssl)
    
    if not verify_ssl:
        logger.warning("SSL certificate verification is disabled!")
    
    try:
        # Fetch all facilities
        facilities = fetch_all_facilities(
            session=session,
            sleep_seconds=args.sleep,
            max_pages=args.max_pages,
            timeout=args.timeout,
        )
        
        if not facilities:
            logger.error("No facilities data retrieved. Please check your connection.")
            return 1
        
        # Flatten data to DataFrame
        df = flatten_facilities_data(facilities)
        
        # Save to Excel
        save_to_excel(df, args.out)
        
        logger.info("=" * 60)
        logger.info("Extraction completed successfully!")
        logger.info(f"Total facilities: {len(facilities)}")
        logger.info(f"Output file: {args.out}")
        logger.info("=" * 60)
        
        return 0
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to fetch facilities data: {e}")
        return 1
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())
