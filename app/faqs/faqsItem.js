import { useRef, useState } from "react";
import styles from './faqs.module.css'
export default function FaqItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.faqItem}>
      <div className={styles.question} onClick={toggleOpen}>
        <span>{question}</span>
        <span>{isOpen ? '-' : '+'}</span>
      </div>
      <div
        ref={contentRef}
        className={`${styles.answer} ${isOpen ? styles.open : styles.closed}`}
        style={{ height: isOpen ? `${contentRef.current.scrollHeight}px` : '0px' }}
      >
        <div className={styles.answerContent}>
          {answer}
        </div>
      </div>
    </div>
    )
}