import img1 from "./img1.webp";
import img2 from "./img2.webp";
import img3 from "./img3.webp";
import type {Props} from "components/App/MainSection";


export const mainSectionData: Props["dataBlocks"] = [
    {
        "imageUrl": img1,
        "text": {
            "title": "How can we double our sales revenue?",
            "paragraph": "Hydra learns your business. By analyzing your sales data, Hydra optimizes your sales process and show you where you should be spending your resources.",
        }
    },
    {
        "imageUrl": img2,
        "text": {
            "title": "How can I keep track of my sales team?",
            "paragraph": "Hydra learns your business. By analyzing your sales data, Hydra optimizes your sales process and show you where you should be spending your resources.",
        }
    },
    {
        "imageUrl": img3,
        "text": {
            "title": "How can I forecast the next 90 days?",
            "paragraph": "Hydra learns your business. By analyzing your sales data, Hydra optimizes your sales process and show you where you should be spending your resources."
        }

    }
]