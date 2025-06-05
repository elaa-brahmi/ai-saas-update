"use client"
import {useState} from 'react'
import {Card} from '@/components/ui/card'
import {NavigationControls} from '@/components/summaries/NavigationControls'
import ProgressBar from "@/components/summaries/progress-bar"
import ContentSection from "@/components/summaries/content-section"
import { MotionDiv, MotionH1, MotionH2, MotionH3, MotionSection,MotionSpan } from '../common/motion-wrapper'
import {containerVariants, itemVariants} from '@/utils/constants'
const SectionTitle=({title}:{title:string})=>{
    return <div className="flex flex-col gap-2 mb-6 sticky top-0
    pt-2 pb-4 bg-background/80 backdrop-blur-xs z-10">
        <h2 className="text-3xl lg:text-4xl font-bold text-center flex-items-center
        justify-center gap-2">{title}</h2>
    </div>
}
const parseSection = (section: string):{title:string;points:string[]} => {
    const [title, ...content] = section.split('\n');
    const cleanTitle=title.startsWith('#') ? title.substring(1).trim():title.trim();
    const points:String[]=[];
    let currentPoint='';
    content.forEach((line)=>{
        const trimmedLine=line.trim();
        if(trimmedLine.startsWith('●')){
            if(currentPoint) points.push(currentPoint.trim());
            currentPoint=trimmedLine;
        }
        else if(!trimmedLine){
            if(currentPoint) points.push(currentPoint.trim());
            currentPoint='';

        }
        else{
            currentPoint+=' '+trimmedLine;
        }

    });
    if(currentPoint) points.push(currentPoint.trim());
    return { title:cleanTitle, points:points.filter((point)=>
        point && !point.startsWith('#') && !point.startsWith('[Choose')
    ) as string[] };
}
export default function SummaryViewer({summary}:{summary:string}){
    const [currentSection,setCurrentSection]=useState(0);
    const handleNext=()=>setCurrentSection((prev)=>Math.min(prev+1,sections.length-1));
    const handlePrevious=()=>setCurrentSection((prev)=>Math.max(prev-1,0));
    const handleSectionSelect=(index:number)=>
        setCurrentSection(Math.min(Math.max(index,0),sections.length-1));

   
        const sections = summary
        .split('\n#')
        .map((section) => section.trim())
        .filter(Boolean)
        .map(parseSection);
        
        return (
        <Card className="relative px-2
        h-[450px] sm:h-[500px] lg:h-[500px]
        w-full xl:w-[620px]
        overflow-hidden
        bg-linear-to-br from-background via-background/95
        to-rose-500/5
        backdrop-blur-lg shadow-2xl rounded-3xl
        border border-rose-500/10"
        
        >
        <ProgressBar
        sections={sections}
        currentSection={currentSection}/>
        <MotionDiv
        key={currentSection}
        initial={{ opacity:0 }}
        whileInView={{ opacity:1 }}
        transition={{ duration:0.2,ease:'easeInOut'}}
        exit={{ opacity:0 }}
        className="h-full overflow-y-auto scrollbar-hide pt-12
        sm:pt-16 pb-20 sm:pb-24">
            <div className="px-4 sm:px-6">
                <SectionTitle title={sections[currentSection]?.title || ''}/>
                <ContentSection
                title={sections[currentSection]?.title || ''}
                points={sections[currentSection]?.points || ''}/>
               

            </div>

        </MotionDiv>

        <NavigationControls
        currentSection={currentSection}
        totalSections={sections.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSectionSelect={setCurrentSection}/>
        </Card>
        
        );
    

}