<?php

namespace Strides\Module\Contracts;

interface FileGeneratorInterface
{
    public function generate(string $dirName, string $fileName, string $content): string;
}
