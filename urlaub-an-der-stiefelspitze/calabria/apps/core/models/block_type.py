from django.db import models


class BlockType(models.Model):
    name = models.CharField(max_length=255, verbose_name='Name', unique=True)
    slug = models.CharField(max_length=255, verbose_name='Slug', unique=True)

    class Meta:
        db_table = 'core_block_type'

    def __str__(self):
        return f'Block type {self.name}'
