import React from 'react';
import Link from './Link';

function Credit(name, role, link) {
    return (
        link ?
            <li className={'about__section__paragraph__credit'}>
                <Link classes={'about__section__paragraph__credit__name'} url={link} target={'_blank'} text={name}/>
                <span className={'about__section__paragraph__credit__role'}>{role}</span>
            </li>
            :
            <li className={'about__section__paragraph__credit'}>
                <span className={'about__section__paragraph__credit__name'}>{name}</span>
                <span className={'about__section__paragraph__credit__role'}>{role}</span>
            </li>
    );
}

function About() {
    return (
        <div className={'about'}>
            <h1 className={'about__title'}>About</h1>
            <div className={'about__section'}>
                <p className={'about__section__paragraph'}>
                    The mission of the Interactive Principles project is help
                    make research backed principles from the learning sciences
                    more understandable and usable for designers of
                    instructional technologies and experiences, specifically
                    educational games. We do this by providing examples and
                    contextualizing the design questions that can have
                    pedagogical impacts. This current site is primarily design
                    for use in Carnegie Mellon University’s 05-418/818 Design
                    of Educational Games course (<a className={'link'} href={'https://edugames.design'} target={'_blank'}>https://edugames.design</a>) as a tool to
                    help students in learning, exploring, and working with principles
                    covered in the course.
                </p>
                <p className={'about__section__paragraph'}>
                    The current set of 30 principles shown on the site is from Koedinger, Booth, and Klahr’s 2013 article Instructional
                    Complexity and the Science to Constrain It [1], in which the authors summarized a number of different principle sets
                    into a concise set of 30.
                </p>
                <p className={'about__section__paragraph'}>
                    Many other sets of Learning Science Principles have been proposed in the literature. For a listing of several
                    existing taxonomies take a look at the <a className={'link'} href={'https://learnlab.org/research/wiki/Main_Page'} target={'_blank'}>LearnLab Theory Wiki</a>. If you are a
                    researcher or know about additional sets of principles that you think could be incorporated into the project feel free to reach out to us.              
                </p>
            </div>

            <h2 className={'about__subtitle'}>References</h2>
            <div className={'about__section'}>
                <div className={'about__section__paragraph about__section__paragraph--list'}>
                    <ol>
                        <li>Kenneth R Koedinger, Julie L Booth, and David Klahr. 2013.
                            Instructional Complexity and the Science to Constrain It.
                            Science 342, 6161: 935–937. <a className={'link'} href={'https://doi.org/10.1126/science.1238056'} target={'_blank'}>https://doi.org/10.1126/science.1238056</a> </li>
                    </ol>
                </div>
            </div>

            <h2 className={'about__subtitle'}>Privacy</h2>
            <div className={'about__section'}>
                <p className={'about__section__paragraph'}>
                    To understand how the deck is used, this site counts page and card views
                    with <a className={'link'} href={'https://www.goatcounter.com'} target={'_blank'} rel={'noopener noreferrer'}>GoatCounter</a>,
                    a privacy-friendly analytics service. It does not use cookies and does not
                    collect personal information.
                </p>
            </div>

            <h2 className={'about__subtitle'}>Team</h2>
            <div className={'about__section'}>
                <div className={'about__section__paragraph about__section__paragraph--list'}>
                    <ul>
                        {Credit('Erik Harpstead', 'Project Lead', 'http://www.erikharpstead.net/')}
                        {Credit('Katie McTigue', 'Design, Content, Development', 'http://katiemctigue.com')}
                        {Credit('Minji Kim', 'Design, Content')}
                        {Credit('Nicole Wang', 'Design')}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default About;