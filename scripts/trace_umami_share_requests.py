from playwright.sync_api import sync_playwright


def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1400, "height": 900})

        page.on(
            "request",
            lambda request: print(f"request:{request.method}:{request.url}")
            if "/api/" in request.url
            or "/share/" in request.url
            or "/analytics/" in request.url
            else None,
        )
        page.on(
            "response",
            lambda response: print(f"response:{response.status}:{response.url}")
            if "/api/" in response.url
            or "/share/" in response.url
            or "/analytics/" in response.url
            else None,
        )

        page.goto(
            "https://cloud.umami.is/analytics/us/share/TJc6ZqRHHPXtsbOQ",
            wait_until="domcontentloaded",
        )
        page.wait_for_timeout(12000)
        browser.close()


if __name__ == "__main__":
    main()
