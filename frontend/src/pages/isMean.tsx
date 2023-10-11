import axios from 'axios';

export async function isMean(content: string) {
	try {
		const response = await axios.post('https://api.openai.com/v1/chat/completions', {
			model: "gpt-3.5-turbo",
			messages: [
				{ "role": "user", "content": `Is the following content bullying or mean? Account for passive aggressiveness & sarcasm, & any type of mean content. Answer with only either 'yes' or 'no', in lower case - no full stops: "${content}"` }
			]
		}, {
			headers: {
				'Authorization': `Bearer ${(import.meta.env.VITE_OPENAI_API_KEY as string)}`,
				'Content-Type': 'application/json'
			}
		});

		/** Process the response to get the answer */
		const answer = response.data.choices[0].message.content.trim().toLowerCase();
		// console.log(answer)
		return answer === "yes";
	} catch (error) {
		console.error('Error calling the API:', error.response ? error.response.data : error);
		return false;
	}
}