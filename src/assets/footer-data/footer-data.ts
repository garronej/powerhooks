import type {Props} from "components/App/Footer";
import FacebookIcon from '@material-ui/icons/Facebook';
import RedditIcon from '@material-ui/icons/Reddit';
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
            "logo": FacebookIcon,
            "name": "Facebook",
            "url": "https://www.facebook.com/"
        },
        {
            "logo": RedditIcon,
            "name": "Reddit",
            "url": "https://www.reddit.com/"
        }
    ],

    "licence": "Code licensed under MIT License"

}