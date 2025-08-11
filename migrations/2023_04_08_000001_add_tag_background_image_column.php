<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasColumn('tags', 'wusong8899_background_url')) {
            $schema->table('tags', function (Blueprint $table) {
                $table->string('wusong8899_background_url', 200)->nullable();
            });

            $schema->table('tags', function (Blueprint $table) {
                $table->boolean('wusong8899_background_hide_name')->default(0);
            });
        }
    },
    'down' => function (Builder $schema) {
        $schema->table('tags', function (Blueprint $table) {
            $table->dropColumn('wusong8899_background_url');
            $table->dropColumn('wusong8899_background_hide_name');
        });
    },
];
