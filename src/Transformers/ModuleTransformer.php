<?php

namespace Strides\Module\Transformers;

use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

/**
 * Base transformer class providing dynamic relation inclusion and standardized response structures.
 */
abstract class ModuleTransformer extends JsonResource
{
    /**
     * HTTP-статус ответа.
     */
    protected int $statusCode = 200;

    /**
     * Список разрешенных связей (includes).
     * Переопределяется в дочерних классах.
     *
     * @var array<int, string>
     */
    protected array $availableIncludes = [];

    /**
     * Абстрактный метод, который должен реализовать каждый конкретный трансформер.
     * Переименован во избежание конфликта имен с методами JsonResource.
     *
     * @return array<string, mixed>
     */
    abstract public function transformModel(mixed $model): array;

    /**
     * Установка HTTP-статуса для цепочки вызовов.
     */
    public function withStatusCode(int $statusCode): self
    {
        $this->statusCode = $statusCode;

        return $this;
    }

    /**
     * Метод для обработки одиночной модели.
     * Полностью совместим с сигнатурой родительского JsonResource::make(...$parameters)
     *
     * @param  mixed  ...$parameters
     * @return static
     */
    public static function make(...$parameters)
    {
        // Извлекаем первый параметр как модель/ресурс
        $resource = $parameters[0] ?? null;

        // Извлекаем второй параметр как HTTP-статус (по умолчанию 200)
        $status = $parameters[1] ?? 200;

        /** @phpstan-ignore-next-line */
        return (new static($resource))->withStatusCode($status);
    }

    /**
     * Метод для обработки коллекции моделей.
     */
    public static function collection($resource, int $status = 200)
    {
        return new TransformerCollection($resource, static::class, $status);
    }

    /**
     * Переопределение базового метода Laravel для трансформации данных.
     *
     * @param  Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        if (is_null($this->resource)) {
            return [];
        }

        $data = $this->transformModel($this->resource);

        $includes = $this->parseIncludes($request);

        foreach ($includes as $include) {
            // Мы только проверяем, что связь разрешена И уже загружена. Никаких запросов в БД.
            if (in_array($include, $this->availableIncludes) && $this->isRelationLoaded($include)) {

                $relatedData = $this->resource->{$include};
                $methodName = 'include'.Str::studly($include);

                if (method_exists($this, $methodName)) {
                    $data[$include] = $this->{$methodName}($relatedData);
                } else {
                    if ($relatedData instanceof EloquentCollection || $relatedData instanceof Model) {
                        $data[$include] = $relatedData->toArray();
                    } else {
                        $data[$include] = $relatedData;
                    }
                }
            }
        }

        return $data;
    }

    /**
     * Форматирование финального JSON-ответа для одиночной модели.
     */
    public function toResponse($request): JsonResponse
    {
        return new JsonResponse([
            'status' => true,
            'data' => $this->resolve($request),
        ], $this->statusCode);
    }

    /**
     * Парсинг связей из GET-запроса (?include=comments,author).
     *
     * @return array<int, string>
     */
    private function parseIncludes(Request $request): array
    {
        $includeParam = $request->query('include', '');

        if (empty($includeParam) || ! is_string($includeParam)) {
            return [];
        }

        return array_filter(array_map('trim', explode(',', $includeParam)));
    }

    /**
     * Безопасная проверка, загружена ли связь, без обращения к БД.
     */
    private function isRelationLoaded(string $relation): bool
    {
        if (! is_object($this->resource)) {
            return false;
        }

        return method_exists($this->resource, 'relationLoaded')
            && $this->resource->relationLoaded($relation);
    }
}
