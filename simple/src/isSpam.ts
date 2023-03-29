const fetchUrlCache = new Map<string, string>();

const getAllUrls = (Content: string): string[] => {
  const regex =
    /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/g;
  const urls = Content.match(regex);
  return urls ?? [];
}

const checkUrlsIncludeSpamLink = (
  urls: string[],
  spamLinkDomains: string[]
): boolean => {
  if (urls.length === 0) {
    return false;
  }

  const hostnames = urls.map((url) => {
    const hostname = new URL(url).hostname;
    return hostname;
  });

  if (hostnames.some((hostname) => spamLinkDomains.includes(hostname))) {
    return true;
  }
  return false;
}

const getContentsFromUrl = async (url: string) => {
  const cachedContent = fetchUrlCache.get(url);
  if (cachedContent) {
    return cachedContent;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url} Response is not ok`);
  }
  
  const content = response.redirected ? response.url : await response.text();
  fetchUrlCache.set(url, content);
  return content;
}

const fetchUrlToCheckSpam = async (
  url: string,
  spamLinkDomains: string[],
  redirectionDepth: number
) => {
  const content = await getContentsFromUrl(url);
  return isSpam(content, spamLinkDomains, redirectionDepth - 1);
};

/*
@param Content
  Is a text string that a user wrote.

@param spamLinkDomains 
  are domains of links that we consider as “spam”.
  Such as [“www.naver.com” / “www.daum.net” / “www.google.com” ]

@param redirectionDepth 
  are how many redirections this function would follow to check if the link is spam.
  Redirection could be either,
  301 / 302 HTTP redirection
  Site contains <a href=”link”></a> tag.
  if it is 0, this function would not follow any redirections.

@return Promise<boolean>
  Asynchronously return if the content is a spam.
*/
export const isSpam = async (
  Content: string,
  spamLinkDomains: string[],
  redirectionDepth: number
): Promise<boolean> => {
  const urls = getAllUrls(Content);
  if (checkUrlsIncludeSpamLink(urls, spamLinkDomains)) {
    return true;
  }

  if (redirectionDepth === 0) {
    return false;
  }

  const results = await Promise.all(
    urls.map(async (url) => {
      try {
        return fetchUrlToCheckSpam(url, spamLinkDomains, redirectionDepth);
      } catch (err) {
        console.error(err);
        return false;
      }
    })
  );

  return results.includes(true);
}
