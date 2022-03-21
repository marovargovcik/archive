from django.db import models
from django.urls import reverse


class Block(models.Model):
    title = models.CharField(blank=True, max_length=255, verbose_name='Title')
    position = models.PositiveSmallIntegerField(
        blank=True, verbose_name='Position')
    page_translation = models.ForeignKey(
        'PageTranslation', on_delete=models.CASCADE, related_name='block_set')
    type = models.ForeignKey(
        'BlockType', on_delete=models.CASCADE, related_name='+')

    class Meta:
        ordering = ('position',)

    def __str__(self):
        return f'Block {self.type.name} in {self.page_translation.name} at position {self.position}'

    def __init__(self, *args, **kwargs):
        super(Block, self).__init__(*args, **kwargs)
        self.__original_position = self.position

    def load(self):
        if self.type.slug == 'imgur-album':
            return self.imguralbumblock
        elif self.type.slug == 'imgur-image':
            return self.imgurimageblock
        elif self.type.slug == 'page-jumps':
            return self.pagejumpsblock
        elif self.type.slug == 'static':
            return self.staticblock
        elif self.type.slug == 'text':
            return self.textblock
        elif self.type.slug == 'video':
            return self.videoblock
        elif self.type.slug == 'map':
            return self.mapblock

    def save(self, *args, **kwargs):
        translation_blocks_count = self.page_translation.block_set.count()
        # New block
        if not self.pk:
            # Prevent position number larger than count of existing blocks + 1
            # or if position is not specified
            if not self.position or self.position > translation_blocks_count + 1:
                self.position = translation_blocks_count + 1
            # If position is specified and block on this position exists update position
            # of all blocks coming after by + 1
            try:
                existing_block = self.page_translation.block_set.get(
                    position=self.position)
            except Block.DoesNotExist:
                existing_block = None
            if existing_block is not None:
                self.page_translation.block_set.filter(
                    position__gte=self.position,
                ).update(position=models.F('position') + 1)
        # Editing existing block
        if self.pk:
            # Prevent position number larger than count of existing blocks
            # or if position is not specified
            if not self.position or self.position > translation_blocks_count:
                self.position = translation_blocks_count
            # Update position numbers of existing blocks when moving block up or down
            if self.position > self.__original_position:
                self.page_translation.block_set.filter(
                    position__gt=self.__original_position,
                    position__lte=self.position,
                ).update(position=models.F('position') - 1)
            else:
                self.page_translation.block_set.filter(
                    position__gte=self.position,
                    position__lt=self.__original_position,
                ).update(position=models.F('position') + 1)
        return super(Block, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        self.page_translation.block_set.filter(
            position__gt=self.position,
        ).update(position=models.F('position') - 1)
        super(Block, self).delete(*args, **kwargs)

    def get_template(self):
        return f'block_types/{self.type.slug.replace("-", "_")}.html'

    def get_edit_url(self):
        return reverse('admin_page_translation_blocks_edit', kwargs={
            'pk': self.page_translation.page.pk,
            'language': self.page_translation.language,
            'block_pk': self.pk,
        })

    def get_delete_url(self):
        return reverse('admin_page_translation_blocks_delete', kwargs={
            'pk': self.page_translation.page.pk,
            'language': self.page_translation.language,
            'block_pk': self.pk,
        })
