import {ReactComponent as appStoreLogo} from "./app-store.svg"
import {ReactComponent as photoLogo} from "./photos.svg"
import {ReactComponent as twitterLogo} from "./twitter.svg"
import type {Props} from "components/App/ReviewSlider";


export const reviewSliderData: Props["reviews"] = [
    {
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam egestas justo nisl, nec dignissim odio pulvinar ut. Sed eget lacus velit. Aenean venenatis, turpis eget accumsan consectetur, tortor augue mattis odio, eget efficitur turpis sapien vel elit.",
        "Logo": appStoreLogo,
        "signature": "Boris Johnson"
    },
    {
        "description": "Aliquam semper eget quam sed iaculis. Pellentesque vitae mollis velit. Maecenas ac odio et sapien viverra gravida vitae sit amet dui. Mauris convallis eros vitae nunc pharetra, non euismod erat lobortis.",
        "Logo": photoLogo,
        "signature": "Vladimir Putin"
    },
    {
        "description": "Sed iaculis, lacus at eleifend porta, purus magna varius arcu, vel tincidunt lorem dolor at massa. Aenean semper et metus ut blandit. Duis finibus tortor in nulla sagittis, et maximus sapien lobortis.",
        "Logo": twitterLogo,
        "signature": "Donald Trump"
    }
]


