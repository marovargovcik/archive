from urllib.parse import urlparse, urljoin

from django import template

register = template.Library()


@register.filter
def translation_exists(page, language):
    return page.get_translation(language=language) is not None


@register.filter
def get_translation(page, language):
    return page.get_translation(language=language)


@register.filter
def get_imgur_thumbnail(url, suffix=''):
    try:
        image_id, extension = urlparse(url).path.split('.')
        return urljoin(url, f'{image_id + suffix}.{extension}')
    except:
        return None


@register.filter
def get_resize_url(url, query_string):
    return f'https://acghaeyymp.cloudimg.io/v7/{url}?{query_string}'


@register.filter
def get_absolute_url(request, url=None):
    if url is None:
        url = request.get_full_path()
    return request.build_absolute_uri(url)
