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

@return Promise<boolean>
  Asynchronously return if the content is a spam.
*/
async function isSpam(Content: string, spamLinkDomains: string[], redirectionDepth: number): boolean {

}