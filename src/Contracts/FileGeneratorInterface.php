<?php

namespace Strides\Module\Contracts;

interface FileGeneratorInterface
{
    public function generate(string $filePath, string $content): string;
}
