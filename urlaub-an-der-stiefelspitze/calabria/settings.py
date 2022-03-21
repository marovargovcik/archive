import os
import calabria.env as env

from django.urls import reverse_lazy


# https://stackoverflow.com/a/31097342
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# https://docs.djangoproject.com/en/2.1/ref/settings/#std:setting-SECRET_KEY
SECRET_KEY = env.SECRET_KEY

# https://docs.djangoproject.com/en/2.1/ref/settings/#debug
DEBUG = env.DEBUG

# https://docs.djangoproject.com/en/2.1/ref/settings/#allowed-hosts
ALLOWED_HOSTS = [
    '127.0.0.1',
    'localhost',
] + env.HOST

# Permission NGINX fix
# https://stackoverflow.com/questions/51439689/django-nginx-error-403-forbidden-when-serving-media-files-over-some-size
FILE_UPLOAD_PERMISSIONS = 0o640

# https://docs.djangoproject.com/en/2.1/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'HOST': env.DB_HOST,
        'PORT': env.DB_PORT,
        'NAME': env.DB_NAME,
        'USER': env.DB_USER,
        'PASSWORD': env.DB_PASSWORD,
    }
}

# https://docs.djangoproject.com/en/2.2/topics/email/
EMAIL_HOST = env.EMAIL_HOST
EMAIL_PORT = env.EMAIL_PORT
EMAIL_HOST_USER = env.EMAIL_HOST_USER
EMAIL_HOST_PASSWORD = env.EMAIL_HOST_PASSWORD
EMAIL_USE_TLS = env.EMAIL_USE_TLS
EMAIL_USE_SSL = env.EMAIL_USE_SSL

# https://docs.djangoproject.com/en/2.1/ref/settings/#std:setting-INSTALLED_APPS
INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'calabria.apps.core',
    'crispy_forms',
]

# https://docs.djangoproject.com/en/2.1/ref/settings/#middleware
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# https://docs.djangoproject.com/en/2.1/ref/settings/#root-urlconf
ROOT_URLCONF = 'calabria.urls'

# https://docs.djangoproject.com/en/2.1/ref/settings/#templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates')
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'calabria.apps.core.context_processors.language_codes',
                'calabria.apps.core.context_processors.top_menu_pages',
                'calabria.apps.core.context_processors.bottom_menu_pages',
                'calabria.apps.core.context_processors.contact_form',
                'calabria.apps.core.context_processors.menu',
                'calabria.apps.core.context_processors.branch',
                'calabria.apps.core.context_processors.in_development',
            ],
        },
    },
]

# https://docs.djangoproject.com/en/2.1/ref/settings/#wsgi-application
WSGI_APPLICATION = 'calabria.wsgi.application'

# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Translation and languages options
# https://docs.djangoproject.com/en/2.1/topics/i18n/
USE_I18N = True
USE_L10N = True
USE_TZ = True
TIME_ZONE = 'Europe/Bratislava'
LANGUAGES = [
    ('de', 'Deutsch'),
    ('en', 'English'),
]
LANGUAGE_CODE = 'de'
LOCALE_PATHS = (
    os.path.join(BASE_DIR, 'locale'),
)

# Static files
# https://docs.djangoproject.com/en/2.1/howto/static-files/
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# https://docs.djangoproject.com/en/2.1/ref/settings/#login-url
LOGIN_URL = reverse_lazy('admin_login')

# https://docs.djangoproject.com/en/2.1/ref/settings/#logout-redirect-url
LOGIN_REDIRECT_URL = reverse_lazy('admin_pages_listing')

# https://django-crispy-forms.readthedocs.io/en/latest/install.html#template-packs
CRISPY_TEMPLATE_PACK = 'bootstrap4'

# imgur integration
IMGUR_CLIENT_ID = 'fe41ca5eba961dc'
