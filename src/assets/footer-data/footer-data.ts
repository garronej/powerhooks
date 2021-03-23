import type {Props} from "components/App/Footer";
import RedditIcon from '@material-ui/icons/Reddit';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';

export const footerData: Props = {
    "items": [
        {
            "name": "Documentation",
            "url": "https://docs.powerhooks.dev/"
        },
        {
            "name": "Github", 
            "url": "https://github.com/garronej/powerhooks"
        }
    ],

    "socialMediaItems": [
        {
            "logo": TwitterIcon,
            "name": "Twitter",
            "url": "https://twitter.com/?lang=en"
        },
        {
            "logo": RedditIcon,
            "name": "Reddit",
            "url": "https://www.reddit.com/"
        },
        {
            "logo": YouTubeIcon,
            "name": "YouTube",
            "url": "https://www.youtube.com/"

        }
    ],

    "licence": "Code licensed under MIT License"

}