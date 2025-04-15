import createMetascraper from "metascraper";
import metascraperImage from "metascraper-image";
import ky from "ky";

const metascraper = createMetascraper([metascraperImage()]);

/**
 * 로컬 개발에서만 쓰이는 캐시 객체
 *
 * 로컬 개발 시 HMR 등으로 인해 여러번 이미지를 가져오며 페이지 로드가 느려지는 걸 방지하기 위해 사용
 *
 * 배포 빌드 시에는 캐시가 없기 때문에 배포 빌드에서는 영향을 주지 않음
 */
const cache = new Map<string, string>();

/**
 * 해당 페이지를 대표하는 이미지를 가져온다.
 *
 * og:image를 비롯한 여러 메타데이터를 파싱하여 이미지를 가져온다.
 *
 * 이미지를 가져오는데 실패하면 undefined를 반환한다.
 *
 * @param url 이미지를 가져올 페이지의 URL
 * @returns 이미지 URL
 */
export async function getImage(url: string): Promise<string | undefined> {
  try {
    let html;

    if (cache.has(url)) {
      html = cache.get(url);
    } else {
      const response = await ky(url, {
        timeout: 5000,
        ...(url.includes("notion.site") && {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
          },
        }),
      });
      html = await response.text();

      cache.set(url, html);
    }

    const { image } = await metascraper({ url, html });
    return image;
  } catch (e) {
    console.error(e);
    return;
  }
}
