<?php

namespace Strides\Module\Transformers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * Custom resource collection that wraps standard API collections and appends metadata.
 */
class TransformerCollection extends AnonymousResourceCollection
{
    /**
     * HTTP status code for the response.
     */
    protected int $statusCode;

    /**
     * Initialize the collection with resource, transformer class, and HTTP status code.
     */
    public function __construct($resource, $collects, int $statusCode = 200)
    {
        parent::__construct($resource, $collects);
        $this->statusCode = $statusCode;
    }

    /**
     * Transform the resource collection into an HTTP JSON response with custom metadata.
     */
    public function toResponse($request): JsonResponse
    {
        // 1. Получаем стандартный ответ Laravel (он уже умеет обрабатывать и коллекции, и пагинацию)
        $response = parent::toResponse($request);

        // 2. Достаем массив данных ответа
        $data = $response->getData(true);

        // 3. Подмешиваем наш кастомный флаг status в самый корень JSON
        $data = array_merge(['status' => true], $data);

        // 4. Возвращаем JSON с правильным статус-кодом через фабрику JsonResponse
        return new JsonResponse($data, $this->statusCode);
    }
}
