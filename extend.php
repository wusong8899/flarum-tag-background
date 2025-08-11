<?php

use Flarum\Extend;
use Flarum\Tags\Tag;
use Flarum\Tags\Api\Serializer\TagSerializer;

use wusong8899\tagBackground\Controller\TagBackgroundSetImageController;

$extend = [
    (new Extend\Frontend('admin'))->js(__DIR__ . '/js/dist/admin.js')->css(__DIR__ . '/less/admin.less'),
    (new Extend\Frontend('forum'))->js(__DIR__ . '/js/dist/forum.js')->css(__DIR__ . '/less/forum.less'),

    (new Extend\Locales(__DIR__ . '/locale')),

    (new Extend\Model(Tag::class))
        ->cast('wusong8899_background_url', 'string')
        ->cast('wusong8899_background_hide_name', 'boolean'),

    (new Extend\ApiSerializer(TagSerializer::class))
        ->attribute('wusong8899BackgroundURL', function (TagSerializer $serializer, Tag $tag) {
            return $tag->wusong8899_background_url;
        })
        ->attribute('wusong8899BackgroundHideName', function (TagSerializer $serializer, Tag $tag) {
            return $tag->wusong8899_background_hide_name;
        }),

    (new Extend\Routes('api'))
        ->post('/tagBackgroundSetImage', 'tagBackground.update', TagBackgroundSetImageController::class),
];

return $extend;