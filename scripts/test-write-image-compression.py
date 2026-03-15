from pathlib import Path

from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
from playwright.sync_api import expect, sync_playwright


ROOT = Path(__file__).resolve().parents[1]
TEST_IMAGE = ROOT / "public" / "image" / "image3.png"
APP_URL = "http://127.0.0.1:4321/write"


def main() -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1200})

        page.goto(APP_URL, wait_until="networkidle")
        page.locator("input[type='file'][multiple]").set_input_files(str(TEST_IMAGE))

        try:
            expect(page.get_by_text("已压缩", exact=False)).to_be_visible(timeout=15000)
        except PlaywrightTimeoutError:
            expect(page.get_by_text("图片已加入列表")).to_be_visible(timeout=15000)

        image_cards = page.locator(".grid.grid-cols-4.gap-2 > div")
        expect(image_cards).to_have_count(2, timeout=15000)

        compression_badge = page.locator("text=/^-\\d+%$/").first
        expect(compression_badge).to_be_visible(timeout=15000)

        size_badge = page.locator("text=/\\d+(\\.\\d)?\\s?(KB|MB)/").first
        expect(size_badge).to_be_visible(timeout=15000)

        page.screenshot(
            path=str(ROOT / "compression-write-page-test.png"), full_page=True
        )
        browser.close()


if __name__ == "__main__":
    main()
