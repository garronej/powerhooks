import {Header} from "./Header";
import headerImg from "../../assets/img/todo.gif";


export const App = ()=>{

    return(
        <>

            <Header
                headerImageUrl={headerImg}
                title="Powerhooks"
                subTitle="Enhance your React experience"
                buttons={[
                    {
                        "title": "try it",
                        "linkUrl": "https://stackblitz.com/edit/react-ts-jkxthr"
                    },
                    {
                        "title": "learn more",
                        "linkUrl": "https://docs.powerhooks.dev/"
                    }

                ]}
            />
        

            
        
        </>
    )
}