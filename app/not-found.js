import Image from "next/image";
import style from './404.module.css'
import backImg from './image/404.jpg'
export default function Error() {
    return (
        <>
            <div className={style.div}>
                <Image className={style.img} src={backImg} width={500} height={500} alt="404" />
            </div>
        </>
    )
}