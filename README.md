# Spam Filter

## How it looks like

```ts
const isSpam = async (
  Content: string,
  spamLinkDomains: string[],
  redirectionDepth: number
): Promise<boolean>
```

## Parameters

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

## Example

```ts
import { isSpam } from "spam-filter";
isSpam("spam spam https://a.com", ["cc.com", "b.com"], 3);
```