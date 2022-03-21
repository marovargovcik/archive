import requests
from urllib.parse import urlparse

from django.conf import settings


def get_imgur_image(url):
    try:
        parse_result = urlparse(url)
        id = parse_result.path.split('/')[-1]
        response = requests.request(
            'GET',
            f'https://api.imgur.com/3/image/{id}',
            headers={'Authorization': f'Client-ID {settings.IMGUR_CLIENT_ID}'},
        )
        if response.status_code != 200:
            return None
        return response.json().get('data')
    except:
        return None


def get_imgur_album(url):
    try:
        parse_result = urlparse(url)
        id = parse_result.path.split('/')[-1]
        response = requests.request(
            'GET',
            f'https://api.imgur.com/3/album/{id}',
            headers={'Authorization': f'Client-ID {settings.IMGUR_CLIENT_ID}'},
        )
        if response.status_code != 200:
            return []
        return response.json()['data']['images']
    except:
        return []
