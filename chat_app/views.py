from django.shortcuts import render, reverse
from django.contrib.auth.decorators import login_required
from .models import ChatBot
from django.http import HttpResponseRedirect, JsonResponse
import google.generativeai as genai

# Create your views here.
# add here to your generated API key
genai.configure(api_key="AIzaSyAm3ZRW2EIFuvQaiE5N4iAcDN6zwh8t-5I")


@login_required
def ask_question(request):
    if request.method == "POST":
        text = request.POST.get("text")

        # Check if text is empty or None
        if text is None or text.strip() == "":
            return JsonResponse({"error": "Empty text provided"})
        
        model = genai.GenerativeModel("gemini-pro")
        chat = model.start_chat()
        
        # Handle the possibility of an empty response
        response = chat.send_message(text)
        if not response.text.strip():
            return JsonResponse({"error": "Empty response from the generative model"})
        
        user = request.user
        ChatBot.objects.create(text_input=text, gemini_output=response.text, user=user)

        # Extract necessary data from response
        response_data = {
            "text": response.text,  # Assuming response.text contains the relevant response data
            # Add other relevant data from response if needed
        }
        return JsonResponse({"data": response_data})
    else:
        return HttpResponseRedirect(reverse("chat"))  # Redirect to chat page for GET requests


@login_required
def chat(request):
    user = request.user
    chats = ChatBot.objects.filter(user=user)
    return render(request, "chat_bot.html", {"chats": chats})
