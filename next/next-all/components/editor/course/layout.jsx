import Link from 'next/link'

import styles from './layout.module.css'

import {Login} from "../../login";
import Flag from "../../layout/flag";
import CourseDropdown from "../../layout/course-dropdown";
import { useSession, signIn, signOut } from "next-auth/react"

export default function Layout({ children, course, import_id }) {
/*
<CourseDropdown userdata={userdata} />
<Login userdata={userdata} />
*/
//const { userdata, error } = useSWR('https://test.duostories.org/stories/backend_node_test/session', fetch)

//if (error) return <div>failed to load</div>
//if (!userdata) return <div>loading...</div>

    return (
    <>
    <nav className={styles.header_index}>
        <b>Course-Editor</b>
        {course ? <>
        <Flag iso={course.learningLanguage} width={40} flag={course.learningLanguageFlag} flag_file={course.learningLanguageFlagFile}/>
        <Flag iso={course.fromLanguage} width={40*0.9} className={styles.flag_sub} flag={course.fromLanguageFlag} flag_file={course.fromLanguageFlagFile}/>
        <span className={"AvatarEditorHeaderFlagname"} data-cy="course-title">{`${course.learningLanguageName} (from ${course.fromLanguageName})`}</span>
        </> : <></>
        }
        <div style={{marginLeft: "auto"}}></div>
        {course ? <>{course.official ? <span data-cy="label_official"><i>official</i></span> :
            !import_id ?
                <Link id="button_import" className={styles.editor_button} href={`/course/${course.id}/import/12`}
                      data-cy="button_import">
                    <div><img alt="import button" src="/editor/icons/import.svg"/></div>
                    <span>Import</span>
                </Link> :
                <Link id="button_back" className={styles.editor_button} href={`/course/${course.id}`}
                      data-cy="button_back">
                    <div><img alt="back button" src="/editor/icons/back.svg"/></div>
                    <span>Back</span>
                </Link>
        }</> : ""}
        <div style={{marginLeft: "50px"}}></div>
        <Login />
    </nav>
    <div className={styles.main_index}>
        {children}
    </div>
    </>
    )
}



export function CourseEditorHeader({courses, course_id, userdata, import_id}) {
    let course = undefined;
    if(courses) {
        for (let c of courses) {
            if(c.id === course_id) {
                course = c;
                break;
            }
        }
    }

    if(!course || course.fromLanguageName === undefined)
        return <><div className="AvatarEditorHeader">
            <b>Course-Editor</b>
        </div></>
    return <><div className="AvatarEditorHeader">
        <b>Course-Editor</b>
        <Flag iso={course.learningLanguage} width={40} flag={course.learningLanguageFlag} flag_file={course.learningLanguageFlagFile}/>
        <Flag iso={course.fromLanguage} width={40*0.9} className={"flag_sub"} flag={course.fromLanguageFlag} flag_file={course.fromLanguageFlagFile}/>
        <span className={"AvatarEditorHeaderFlagname"} data-cy="course-title">{`${course.learningLanguageName} (from ${course.fromLanguageName})`}</span>
        {course.official ? <span data-cy="label_official"><i>official</i></span> :
            !import_id ?
                <Link id="button_import" className="editor_button" to={`/course/${course.id}/import/12`}
                      style={{marginLeft: "auto"}} data-cy="button_import">
                    <div><img alt="import button" src="/icons/import.svg"/></div>
                    <span>Import</span>
                </Link> :
                <Link id="button_back" className="editor_button" to={`/course/${course.id}`}
                      style={{marginLeft: "auto"}} data-cy="button_back">
                    <div><img alt="back button" src="/icons/back.svg"/></div>
                    <span>Back</span>
                </Link>
        }
        <LoggedInButton userdata={userdata} page="editor"/>
    </div></>
}