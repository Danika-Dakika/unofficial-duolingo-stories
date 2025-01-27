import {Suspense} from "react";
import query from "lib/db";

import LanguageButton from "./language_button";

import styles from "./course_list.module.css"




async function get_courses(tag) {
    let courses = await query(`
SELECT course.id,  COALESCE(NULLIF(course.name, ''), l2.name) as name, course.short,
 l1.short AS fromLanguage, l1.name AS fromLanguageName, l1.flag_file AS fromLanguageFlagFile, l1.flag AS fromLanguageFlag,
 l2.short AS learningLanguage, l2.name AS learningLanguageName, l2.flag_file AS learningLanguageFlagFile, l2.flag AS learningLanguageFlag,
 COUNT(story.id) count, course.public, course.official, course.conlang FROM course
LEFT JOIN language l1 ON l1.id = course.fromLanguage
LEFT JOIN language l2 ON l2.id = course.learningLanguage
LEFT JOIN story ON (course.id = story.course_id)
WHERE story.public = 1 AND story.deleted = 0 AND course.public = 1
GROUP BY course.id
ORDER BY name;
    `);
    if(tag) {
        courses = await query(`
SELECT ct.name, course.id,  COALESCE(NULLIF(course.name, ''), l2.name) as name, course.short,
 l1.short AS fromLanguage, l1.name AS fromLanguageName, l1.flag_file AS fromLanguageFlagFile, l1.flag AS fromLanguageFlag,
 l2.short AS learningLanguage, l2.name AS learningLanguageName, l2.flag_file AS learningLanguageFlagFile, l2.flag AS learningLanguageFlag,
 COUNT(story.id) count, course.public, course.official, course.conlang FROM course
JOIN course_tag_map ctm on course.id = ctm.course_id
JOIN course_tag ct on ctm.course_tag_id = ct.id
JOIN language l1 ON l1.id = course.fromLanguage
JOIN language l2 ON l2.id = course.learningLanguage
JOIN story ON (course.id = story.course_id)
WHERE story.public = 1 AND story.deleted = 0 AND ct.name = ? AND course.public = 1
GROUP BY course.id
ORDER BY name;
    `, [tag]);
    }
    // sort courses by base language
    let base_languages = {};
    let languages = [];
    // iterate over all courses
    for (let course of courses) {
        // if base language not yet in list
        if (base_languages[course.fromLanguageName] === undefined) {
            // initialize the list
            base_languages[course.fromLanguageName] = [];
            // and add it to the list of all base languages (we will add English after sorting in the front)
            if (course.fromLanguageName !== "English")
                languages.push(course.fromLanguageName);
        }
        base_languages[course.fromLanguageName].push(Object.assign({}, course));
    }
    // sort the base languages and then add English as first (and most relevant)
    languages = languages.sort();
    // if we have english courses add "English" as the first entry
    if (base_languages["English"])
        languages.unshift("English");

    // create a new sorted
    let grouped_languages = {};
    for (let lang of languages) {
        grouped_languages[lang] = base_languages[lang];
    }

    return grouped_languages;
}

async function CourseListInner({loading, tag}) {
    if(loading) {
        return <div className={styles.course_list}>
            <hr/>
            <div className={styles.course_group_name}><span className={styles.loading}>Stories for English Speakers</span></div>
            {[...Array(10)].map((d, i) =>
                <LanguageButton key={i}/>
            )}
        </div>
    }
    let courses = await get_courses(tag);

    return <>{Object.entries(courses).map(([name,]) => (
        <div className={styles.course_list} key={name}>
            <hr/>
            <div className={styles.course_group_name}>Stories for {name} Speakers</div>
            {courses[name].map(course => (
                <LanguageButton key={course.id} course={course} />
            ))}
        </div>
    ))
    }</>
}

export default async function CourseList({tag}) {
    return <Suspense fallback={<CourseListInner loading={true} />}>
        <CourseListInner tag={tag}/>
    </Suspense>
}
