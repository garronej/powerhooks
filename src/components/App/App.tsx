import {Header} from "./Header";
import {headerData} from "assets/header-data/index";
import {MainSection} from "./MainSection";
import {mainSectionData} from "assets/main-section-data/index";
import {reviewSliderData} from "assets/review-slider-data/index";
import {ReviewSlider} from "./ReviewSlider";


export const App = ()=>{

    return(
        <>

            <Header
                {...headerData}
            />

            <MainSection 
                dataBlocks={mainSectionData}
            />

             <ReviewSlider

                reviews={reviewSliderData}
            />
        

            
        
         </>
    )
}