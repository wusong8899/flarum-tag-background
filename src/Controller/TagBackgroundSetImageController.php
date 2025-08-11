<?php

namespace wusong8899\tagBackground\Controller;

use Flarum\Tags\Tag;
use Flarum\Tags\Api\Serializer\TagSerializer;

use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Foundation\ValidationException;
use Flarum\Locale\Translator;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Illuminate\Support\Arr;

class TagBackgroundSetImageController extends AbstractCreateController
{
    public $serializer = TagSerializer::class;
    protected $translator;

    public function __construct(Translator $translator)
    {
        $this->translator = $translator;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = $request->getAttribute('actor');
        $actor->assertAdmin();

        $tagID = Arr::get($request->getParsedBody(), 'tagID');
        $backgroundUrl = Arr::get($request->getParsedBody(), 'backgroundUrl');

        if (!isset($tagID)) {
            $errorMessage = 'wusong8899-tag-background.forum.save-error';
        } else {
            $errorMessage = "";
            $tagData = Tag::find($tagID);

            if (!isset($tagData)) {
                $errorMessage = 'wusong8899-tag-background.forum.save-error';
            } else {
                $tagData->wusong8899_background_url = $backgroundUrl;
                $tagData->save();

                return $tagData;
            }
        }

        if ($errorMessage !== "") {
            throw new ValidationException(['message' => $this->translator->trans($errorMessage)]);
        }
    }
}
