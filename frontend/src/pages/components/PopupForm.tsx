import styles from './PopupForm.module.css';


export default function PopupForm({ card, handleClose, handleSubmit, reply, setReply, comments, setComments }) {
	return (
		<>
			<div className={styles.popup} onClick={handleClose}>
				<div className={styles.popupContainer}>
					<p className={styles.note}>{card.note}</p>
					<div className={styles.textContainer}>
						<p>Reply</p>
						<textarea
							className={styles.textarea}
							name="Reply"
							rows="3"
							placeholder="Your Reply"
							value={reply}
							onChange={e => setReply(e.target.value)}
							onClick={(event) => event.stopPropagation()}
						/>
						<p>Comments</p>
						<textarea
							className={styles.textarea}
							name="Comments"
							rows="3"
							placeholder="Comments"
							value={comments}
							onChange={e => setComments(e.target.value)}
							onClick={(event) => event.stopPropagation()}
						/>
						{/* Modify this button: */}
						<button onClick={() => handleSubmit(event, card.topic, card.note)} className={styles.niceButton}>Submit</button>
					</div>
				</div>
			</div>
		</>
	)
}