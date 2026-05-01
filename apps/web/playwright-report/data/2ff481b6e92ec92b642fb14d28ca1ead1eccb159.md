# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: navigation.spec.ts >> Navigation >> should navigate to "How it Works" page
- Location: e2e\navigation.spec.ts:13:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:3000/how"
Received: "http://localhost:3000/"
Timeout:  5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    8 × unexpected value "http://localhost:3000/"

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - link "Muzika Logo U Muzika" [ref=e5] [cursor=pointer]:
        - /url: /
        - img "Muzika Logo" [ref=e7]
        - generic [ref=e8]: U Muzika
      - generic [ref=e10]:
        - img [ref=e11]
        - textbox "Search artists, tracks..." [ref=e14]
      - generic [ref=e15]:
        - generic [ref=e16]:
          - button "en" [ref=e18]:
            - img
            - generic [ref=e19]: en
            - img
          - button [ref=e20]:
            - img
        - link "Sign In" [ref=e22] [cursor=pointer]:
          - /url: /login
    - main [ref=e23]:
      - generic [ref=e25]:
        - generic [ref=e27]:
          - link [ref=e29] [cursor=pointer]:
            - /url: /a/UCAlTDckOOQ2jREOvuCShGbw
            - img "Bob Marley" [ref=e31]
            - generic [ref=e32]:
              - heading "Bob Marley" [level=3] [ref=e33]
              - paragraph [ref=e34]: Jamaican singer, musician, songwriter, and activist Bob Marley has served as a world ambassador for reggae music and sold more than 20 million records throughout his career—making him the first international superstar to emerge from the so-called Third World. Bob Marley was posthumously inducted into the Rock and Roll Hall of Fame in 1994; in December 1999, his 1977 album “Exodus” was named Album of the Century by Time Magazine and his song “One Love” was designated Song of the Millennium by the BBC. Since its release in 1984, Marley’s “Legend” compilation has annually sold over 250,000 copies according to Nielsen Sound Scan, and it is only the 17th album to exceed sales of 10 million copies since SoundScan began its tabulations in 1991. It currently sits as the 2nd highest-selling compilation album of all time, and the 2nd longest Billboard-charting album in history. Today, Bob Marley is known throughout the world for his message of unity, love, self-determination, and RASTAFARI.
          - 'link "Teddy Afro Teddy Afro Welcome to the official Teddy Afro YouTube channel. Tewodros Kassahun, better known by his stage name of Teddy Afro, is an iconic Ethiopian pop star who has dominated the national music scene for the last decade and a half. Since signing with an Ethiopian record label in 2001, the Ethiopian music icon officially released albums are: Abugida (2001), Yasteseryal (2005), Yasteseryal Edition 2 (2005), Tikur Sew (2012) and Ethiopia (2017). His last album Ethiopia, became the most selling album of all times selling 600,000 copies on the day it was released. The album was also on top of billboard’s world music chart, #1 on CDBaby and Itunes album sells, which made it the first album in the nations history. Enjoy! Subscribe!" [ref=e36] [cursor=pointer]':
            - /url: /a/UCydlocDyvRtFmMffKytKqgQ
            - img "Teddy Afro" [ref=e38]
            - generic [ref=e39]:
              - heading "Teddy Afro" [level=3] [ref=e40]
              - paragraph [ref=e41]: "Welcome to the official Teddy Afro YouTube channel. Tewodros Kassahun, better known by his stage name of Teddy Afro, is an iconic Ethiopian pop star who has dominated the national music scene for the last decade and a half. Since signing with an Ethiopian record label in 2001, the Ethiopian music icon officially released albums are: Abugida (2001), Yasteseryal (2005), Yasteseryal Edition 2 (2005), Tikur Sew (2012) and Ethiopia (2017). His last album Ethiopia, became the most selling album of all times selling 600,000 copies on the day it was released. The album was also on top of billboard’s world music chart, #1 on CDBaby and Itunes album sells, which made it the first album in the nations history. Enjoy! Subscribe!"
          - 'link "Burna Boy Burna Boy \"No Sign of Weakness\" out now - burna.lnk.to/nosignofweakness The official YouTube channel of Atlantic Records artist Burna Boy. Subscribe for the latest music videos, performances, and more. See Burna Boy Live: Burna.lnk.to/stadedefrance Follow Burna Boy Website: http://www.onaspaceship.com Instagram: https://Burna.lnk.to/Instagram TikTok: https://Burna.lnk.to/TikTok Twitter: https://Burna.lnk.to/Twitter Facebook: https://Burna.lnk.to/Facebook Listen to Burna Boy Apple Music: https://Burna.lnk.to/AppleMusic Spotify: https://Burna.lnk.to/Spotify Amazon: https://Burna.lnk.to/Amazon Tidal: https://Burna.lnk.to/Tidal Pandora: https://Burna.lnk.to/Pandora SoundCloud: https://Burna.lnk.to/SoundCloud Audiomack: https://Burna.lnk.to/Audiomack Deezer: https://Burna.lnk.to/Deezer" [ref=e43] [cursor=pointer]':
            - /url: /a/UCEzDdNqNkT-7rSfSGSr1hWg
            - img "Burna Boy" [ref=e45]
            - generic [ref=e46]:
              - heading "Burna Boy" [level=3] [ref=e47]
              - paragraph [ref=e48]: "\"No Sign of Weakness\" out now - burna.lnk.to/nosignofweakness The official YouTube channel of Atlantic Records artist Burna Boy. Subscribe for the latest music videos, performances, and more. See Burna Boy Live: Burna.lnk.to/stadedefrance Follow Burna Boy Website: http://www.onaspaceship.com Instagram: https://Burna.lnk.to/Instagram TikTok: https://Burna.lnk.to/TikTok Twitter: https://Burna.lnk.to/Twitter Facebook: https://Burna.lnk.to/Facebook Listen to Burna Boy Apple Music: https://Burna.lnk.to/AppleMusic Spotify: https://Burna.lnk.to/Spotify Amazon: https://Burna.lnk.to/Amazon Tidal: https://Burna.lnk.to/Tidal Pandora: https://Burna.lnk.to/Pandora SoundCloud: https://Burna.lnk.to/SoundCloud Audiomack: https://Burna.lnk.to/Audiomack Deezer: https://Burna.lnk.to/Deezer"
          - link "StarBoy TV StarBoy TV StarBoy Entertainment Official YouTube" [ref=e50] [cursor=pointer]:
            - /url: /a/UCi7Cbr-F3zFQjwafFh5RWJA
            - img "StarBoy TV" [ref=e52]
            - generic [ref=e53]:
              - heading "StarBoy TV" [level=3] [ref=e54]
              - paragraph [ref=e55]: StarBoy Entertainment Official YouTube
          - link "Rophnan Rophnan ROPHNAN III IV IX" [ref=e57] [cursor=pointer]:
            - /url: /a/UC2s9j9EMXMFklxGqDPJp-qQ
            - img "Rophnan" [ref=e59]
            - generic [ref=e60]:
              - heading "Rophnan" [level=3] [ref=e61]
              - paragraph [ref=e62]: ROPHNAN III IV IX
          - link [ref=e64] [cursor=pointer]:
            - /url: /a/UCev-b-xy-p5fHK8x3zJyn1Q
            - img "Diamond Platnumz" [ref=e66]
            - generic [ref=e67]:
              - heading "Diamond Platnumz" [level=3] [ref=e68]
              - paragraph [ref=e69]: Nasibu Abdul Juma Issaack, born on October 2, 1989, and widely recognized by his stage name Diamond Platnumz, is a versatile Tanzanian luminary. Emerging from the humble streets of Tandale, Dar es Salaam, Diamond's journey unfolds as a multifaceted artist, encompassing roles as a Bongo Flava recording artist, actor, dancer, philanthropist, and astute businessman. Elevating the Tanzanian music scene, Diamond Platnumz stands as the highest-selling artist from the region. Acknowledged by music pundits and the media, he holds a position of influence and success, not only in Africa but on a global scale. The resonance of his music has transcended borders, drawing crowds in packed stadiums across Africa and commanding audiences in music venues throughout Europe, Asia, and America. Diamond Platnumz's journey is a testament to the transformative power of talent, determination, and a relentless pursuit of excellence.
          - link "Davido Davido" [ref=e71] [cursor=pointer]:
            - /url: /a/UCkBV3nBa0iRdxEGc4DUS3xA
            - img "Davido" [ref=e73]
            - generic [ref=e74]:
              - heading "Davido" [level=3] [ref=e75]
              - paragraph
        - link "How it Works" [active] [ref=e76] [cursor=pointer]:
          - /url: /how
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e82] [cursor=pointer]:
    - img [ref=e83]
  - alert [ref=e86]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Navigation', () => {
  4  |   test('should navigate to the homepage', async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await expect(page).toHaveURL('/');
  7  |     // Check if the logo is visible
  8  |     await expect(page.getByAltText('Muzika Logo')).toBeVisible();
  9  |     // Check if "U Muzika" text is present
  10 |     await expect(page.getByText('U Muzika', { exact: true })).toBeVisible();
  11 |   });
  12 | 
  13 |   test('should navigate to "How it Works" page', async ({ page }) => {
  14 |     await page.goto('/');
  15 |     await page.click('text=How it Works');
> 16 |     await expect(page).toHaveURL('/how');
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  17 |     // Assuming there's a heading in the "How it Works" page
  18 |     await expect(page.locator('h1')).toBeVisible();
  19 |   });
  20 | 
  21 |   test('should have a working sign in link', async ({ page }) => {
  22 |     await page.goto('/');
  23 |     const signInLink = page.getByRole('link', { name: /sign in/i });
  24 |     await expect(signInLink).toBeVisible();
  25 |     await signInLink.click();
  26 |     await expect(page).toHaveURL(/\/login/);
  27 |   });
  28 | });
  29 | 
```