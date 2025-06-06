import Image from 'next/image'
import { TextEffect } from "@/components/ui/text-effect";


/**
 * ContentSection est un composant qui contient le contenu de la page " À propos de MèchePro".
 * Il contient un titre, un paragraphe introductif, un graphique de démonstration, un paragraphe sur la technique d'analyse de MèchePro,
 * un titre pour la section "Notre équipe", un paragraphe sur l'équipe et une image de l'équipe.
 * Les éléments sont mis en page avec des Grid et des espaces entre eux.
 * Les éléments sont animés avec des effets de fade-in-blur.
 */
export default function ContentSection() {
    return (
        <>  
        <section className="py-16 md:py-32">     
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">       
                <TextEffect
                    per="line"
                    preset="fade-in-blur"
                    speedSegment={0.3}
                    delay={0.5}
                    as="h2"
                    className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl"
                >
                    À propos de MèchePro
                </TextEffect>                          
                <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
                    <div className="relative space-y-4">
                    <TextEffect
                        per="line"
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        delay={1}
                        as="p"
                        className="text-muted-foreground"
                        >
                        MèchePro est une application web qui permet d'automatiser le processus d'analyse boursière.
                    </TextEffect> 

                    <TextEffect
                        per="line"
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        delay={1.5}
                        as="p"
                        className="text-muted-foreground"
                        >
                        Nous faisons l'évaluation des graphiques pour vous! 
                            Il ne suffit que de choisir la bourse que vous souhaitez regarder. C'est simple, fiable et efficace!
                    </TextEffect>   
                                     
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <TextEffect
                                    per="line"
                                    preset="fade-in-blur"
                                    speedSegment={0.3}
                                    delay={2}
                                    as="h3"
                                    className="text-xl font-medium"
                                    >
                                    Notre objectif
                                </TextEffect>   
                            </div>
                            <TextEffect
                                per="line"
                                preset="fade-in-blur"
                                speedSegment={0.3}
                                delay={2.5}
                                as="p"
                                className="text-muted-foreground"
                                >
                                Nous souhaitons offrir au grand public la possibilité
                                de prendre leurs finances en main, sans avoir à dépenser des centaines sur des coach financiers 
                                ou des applications coûteuse.
                            </TextEffect>  
                        </div>   
                                        
                    </div>
                
                    <div className="relative mt-6 sm:mt-0">
                        <div className="bg-linear-to-b aspect-67/34 relative rounded-3xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
                            <Image src="/demo-graphique.jpg" className="rounded-[15px] shadow " alt="image démo de graphique" width={1206} height={612} />
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    <TextEffect
                        per="line"
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        delay={3}
                        as="h3"
                        className="text-xl font-medium"
                        >
                        Technique d'analyse de MèchePro
                    </TextEffect>    
                    <TextEffect
                        per="line"
                        preset="fade-in-blur"
                        speedSegment={0.3}
                        delay={3.5}
                        as="p"
                        className="text-muted-foreground"
                        >
                        Ce projet combine : des moyennes mobiles exponentielles pour détecter les tendance et les croisements ;
                         le RSI pour évaluer le surachat, la survente et les divergences ;
                          les fractales pour repérer les sommets et les creux ;
                         et des zones K-Means de support et résistance basées sur l’historique des prix. 
                         Pour en apprendre plus, créez un compte et commencez à analyser!
                    </TextEffect>    
                </div>            
                <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl mt-16">Notre équipe</h2>
                <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
                    <div className="relative mt-6 sm:mt-0">
                        <div className="bg-linear-to-b aspect-67/34 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
                            <Image src="/img_equipe.jpg" className="rounded-[15px] shadow " alt="image démo de graphique" width={1206} height={612} />
                        </div>
                    </div>
                    <div className="relative space-y-4">
                        <p className="text-2xl font-oswald">
                        Nous sommes une équipe de 4 étudiants en dernière session de CÉGEP: Georges, Valère, Andy et Élian
                        </p>                                                                                                            
                    </div>                   
                </div>
            </div>
            
               
        </section>
        </>
    )
}
