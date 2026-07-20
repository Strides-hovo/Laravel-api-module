<?php

declare(strict_types=1);

namespace Strides\Module\Enums;

use Strides\Module\Enums\Concerns\ResolvableByNameTrait;

enum BuilderKeysEnum
{
    use ResolvableByNameTrait;

    case controller;
    case request;
    case resource;
    case collection;
    case repository;
    case model;
    case seeder;
    case factory;
    case migration;
    case unit_test;
    case feature_test;
    case http;
    case middleware;
    case route;
    case route_service_provider;
    case service_provider;
    case transformer;
    case helper;
    case contract;
    case service;
    case action;
    case event;
    case listener;
    case job;
    case cast;
    case channel;
    case mail;
    case notification;
    case dto;
    case rule;
    case command;
    case policy;
    case module;
    case config;
}
