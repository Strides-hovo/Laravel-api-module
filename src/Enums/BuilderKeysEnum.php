<?php

namespace Strides\Module\Enums;

enum  BuilderKeysEnum
{
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
    case http;
    case middleware;
    case route;
    case route_service_provider;
    case service_provider;
}
