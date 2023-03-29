import { isSpam } from './isSpam';
import { handler } from './middleware';
import { SpamHadlerBody, SpamHadlerResponse } from './types/spam';

export const spam = handler(
  async ({ request, aux }): Promise<SpamHadlerResponse> => {
    const { logger } = aux;
    const body: SpamHadlerBody = request.body;
    const { content, spamLinkDomains, redirectionDepth } = body;
    logger.info(`requset spam filter[depth:${redirectionDepth}]: ${content}`);

    const result = await isSpam(content, spamLinkDomains, redirectionDepth);

    return { isSpam: result };
  },
);
