import createMetascraper from "metascraper";
import metascraperImage from "metascraper-image";
import axios from "axios";

const metascraper = createMetascraper([metascraperImage()]);

/**
 * 로컬 개발에서만 쓰이는 캐시 객체
 *
 * 로컬 개발 시 HMR 등으로 인해 여러번 이미지를 가져오는 것을 방지하기 위해 사용
 *
 * 배포 빌드 시에는 캐시가 없기 때문에 배포 빌드에서는 영향을 주지 않음
 */
const cache = new Map<string, string>();

export async function getImage(url: string): Promise<string | undefined> {
  let html;
  if (cache.has(url)) {
    html = cache.get(url);
  } else {
    const response = await axios.get(url, { timeout: 5000 });
    html = response.data;
    cache.set(url, html);
  }

  const { image } = await metascraper({ url, html });
  return image;
}
