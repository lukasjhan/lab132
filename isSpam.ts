function getAllUrls(Content: string): string[] {
  const regex =
    /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/g;
  const urls = Content.match(regex);
  return urls ?? [];
}

function checkUrlsIncludeSpamLink(
  urls: string[],
  spamLinkDomains: string[]
): boolean {
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

const fetchUrlToCheckSpam = async (
  url: string,
  spamLinkDomains: string[],
  redirectionDepth: number
) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url} Response is not ok`);
  }

  if (response.redirected) {
    const redirectedUrl = response.url;
    if (checkUrlsIncludeSpamLink([redirectedUrl], spamLinkDomains)) {
      return true;
    }
    return isSpam(redirectedUrl, spamLinkDomains, redirectionDepth - 1);
  }

  const text = await response.text();
  return isSpam(text, spamLinkDomains, redirectionDepth - 1);
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
export async function isSpam(
  Content: string,
  spamLinkDomains: string[],
  redirectionDepth: number
): Promise<boolean> {
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
