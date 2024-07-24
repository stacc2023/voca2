import os
import re
from google.cloud import texttospeech

# Set up Google Cloud Text-to-Speech client
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.dirname(os.path.abspath(__file__)) + '/tts_cred.json'
client = texttospeech.TextToSpeechClient()

def sanitize_filename(text):
    # Remove any characters that are not letters, numbers, spaces, hyphens, or underscores
    sanitized = re.sub(r'[^a-zA-Z0-9\s\-_]', '', text)
    # Replace spaces with underscores
    sanitized = sanitized.replace(' ', '_')
    return sanitized

# make mp3 and return uri of mp3 file
def tts(text):
    directory = os.path.dirname(os.path.abspath(__file__)) + '/mp3/'
    filename = sanitize_filename(text) + '.mp3'

    if os.path.exists(directory + filename):
        return directory + filename

    synthesis_input = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code='en-US',
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    request = texttospeech.SynthesizeSpeechRequest(
        input=synthesis_input,
        voice=voice,
        audio_config=audio_config
    )

    # Perform the text-to-speech request
    response = client.synthesize_speech(request=request)

    # Save the audio content to a file
    audio_content = response.audio_content
    with open(directory + filename, 'wb') as out:
        out.write(audio_content)

    return directory + filename