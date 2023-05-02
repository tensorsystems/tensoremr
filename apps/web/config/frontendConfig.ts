import ThirdPartyEmailPasswordReact from 'supertokens-auth-react/recipe/thirdpartyemailpassword'
import SessionReact from 'supertokens-auth-react/recipe/session'
import { appInfo } from './appInfo'
import Router from 'next/router'

export const frontendConfig = () => {
  return {
    appInfo,
    recipeList: [
      ThirdPartyEmailPasswordReact.init({
        style: `
        [data-supertokens~=container] {
            --palette-primary: 13, 148, 136;
            --palette-primaryBorder: 16, 185, 129;
            --palette-superTokensBrandingBackground: 255, 255, 255;
            --palette-superTokensBrandingText: 255, 255, 255;
        }
    `,
        signInAndUpFeature: {
          style: `
            [data-supertokens~=headerSubtitle] {
                display: none;
            }
          `,
          providers: [
     
          ],
        },
      }),
      SessionReact.init(),
    ],
    windowHandler: (oI: any) => {
      return {
        ...oI,
        location: {
          ...oI.location,
          setHref: (href: string) => {
            Router.push(href)
          },
        },
      }
    },
  }
}