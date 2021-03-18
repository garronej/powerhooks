import {Header} from "./Header";
import {headerData} from "assets/header-data/index";
import {MainSection} from "./MainSection";
import {mainSectionData} from "assets/main-section-data/index";


export const App = ()=>{

    return(
        <>

            <Header
                {...headerData}
            />

            <MainSection 
                dataBlocks={mainSectionData}
            />
        

            
        
        </>
    )
}