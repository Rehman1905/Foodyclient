'use client'
import FaqItem from './faqsItem'
import styles from './faqs.module.css'
export default function Faqs() {
    const faqs = [
        {
            question: "How to contact with Customer Service?",
            answer: "Our Customer Experience Team is available 7 days a week and we offer 2 ways to get in contact.Email and Chat . We try to reply quickly, so you need not to wait too long for a response!."
        },
        {
            question: "There are products not available in the webshop.",
            answer: "If you cannot find a product in the webshop, it might be out of stock. Please check back later or contact us for more information."
        },
        {
            question: "I want to cancel my order.",
            answer: "To cancel your order, please visit your order history and select the cancel option or contact customer service."
        },
        {
            question: "What payment options are there?",
            answer: "We accept various payment options including credit/debit cards, PayPal, and bank transfers."
        }
    ];
    return (
        <>
            <div className={styles.container}>
                <h1 className={styles.title}>F.A.Q</h1>
                <div className={styles.faqList}>
                    {faqs.map((faq, index) => (
                        <FaqItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div></>
    )
}