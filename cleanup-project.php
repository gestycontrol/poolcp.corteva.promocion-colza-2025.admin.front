<?php
$found_file_to_delete = null;

const STATIC_CUSTOM_FIELD_IMPORT_OPEN = '/** <Static custom field imports> */';
const STATIC_CUSTOM_FIELD_IMPORT_CLOSE = '/** </Static custom field imports> */';
const IMPORT_PLACEHOLDER = STATIC_CUSTOM_FIELD_IMPORT_OPEN . STATIC_CUSTOM_FIELD_IMPORT_CLOSE;
const FIELD_COMPONENT_PATH = __DIR__ . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR . 'components' . DIRECTORY_SEPARATOR . 'common' . DIRECTORY_SEPARATOR . 'form' . DIRECTORY_SEPARATOR . 'Field.vue';

while ($found_file_to_delete !== false) {
    $found_file_to_delete = false;

    $allFileContents = [];
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(__DIR__ . DIRECTORY_SEPARATOR . 'src'));

    foreach ($iterator as $file) {
        if (!$file->isFile()) continue;
        $path = $file->getPathname();
        if (strpos($path, '/.') !== false) continue;
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        if (!in_array($extension, ['js', 'vue', 'svg'])) continue;

        $allFileContents[$path] = file_get_contents($path);

        if (
            $path === FIELD_COMPONENT_PATH
            && false !== ($start = strpos($allFileContents[$path], STATIC_CUSTOM_FIELD_IMPORT_OPEN))
            && false !== ($end = strpos($allFileContents[$path], STATIC_CUSTOM_FIELD_IMPORT_CLOSE))
        ) {
            $before = substr($allFileContents[$path], 0, $start);
            $after  = substr($allFileContents[$path], $end + strlen(STATIC_CUSTOM_FIELD_IMPORT_CLOSE));
            $allFileContents[$path] = $before . IMPORT_PLACEHOLDER . $after;
        }
    }

    $fieldComponentsByType = [
        'dictionary' => 'DictionaryField.vue',
        'combo'      => 'DictionaryField.vue',
        'select'     => 'DictionaryField.vue',
        'dropdown'   => 'DropDownField.vue',
        'checkbox'   => 'CheckboxField.vue',
        'radio'      => 'RadioField.vue',
        'longtext'   => 'LongTextField.vue',
        'textarea'   => 'LongTextField.vue',
        'wysiwyg'    => 'WysiwygField.vue',
        'html'       => 'WysiwygField.vue',
        'imageurl'   => 'ImageUrlField.vue',
        'readonly'   => 'FieldReadonly.vue',
    ];
    $usedFieldComponents = [];

    foreach ($allFileContents as $path => $content) {
        foreach (array_keys($fieldComponentsByType) as $component_alias) {
            if (str_ends_with($path, '/' . $fieldComponentsByType[$component_alias])) {
                continue;
            }

            if (preg_match('/\btype\s*=\s*["\']' . $component_alias . '["\']/', $content)) {
                $usedFieldComponents[$fieldComponentsByType[$component_alias]] = true;
            } elseif (preg_match(
                '/\?\s*\'readonly\'\s*:\s*\'' . preg_quote($component_alias, '/') . '\'/',
                $content
            )) {
                $usedFieldComponents[$fieldComponentsByType[$component_alias]] = true;
                $usedFieldComponents[$fieldComponentsByType['readonly']] = true;
            }
        }

        if (strpos($content, '<Field ') !== false) {
            $usedFieldComponents['TextField.vue'] = true;
        }
    }

    $allPaths = array_keys($allFileContents);

    foreach ($allPaths as $path) {
        $file_is_linked = false;
        $basename = pathinfo($path, PATHINFO_BASENAME);
        $basename_without_extension = pathinfo($path, PATHINFO_FILENAME);

        if (in_array($basename, [
            'main.js',
            'routes.js',
            'App.vue',
            ...array_keys($usedFieldComponents),
        ])) continue;

        $referenceOptions = [
            '/' . $basename_without_extension . '"',
            '/' . $basename_without_extension . '\'',
            '/' . $basename,
        ];

        foreach ($allFileContents as $other_file_content) {
            foreach ($referenceOptions as $referenceOption) {
                if (strpos($other_file_content, $referenceOption) !== false) {
                    $file_is_linked = true;
                    break 2;
                }
            }
        }

        if (!$file_is_linked) {
            $found_file_to_delete = true;
            unlink($path);
            echo 'Deleted ' . $path . PHP_EOL;

            $test_path = str_replace(DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR, DIRECTORY_SEPARATOR . 'test' . DIRECTORY_SEPARATOR, $path);

            if (str_ends_with($test_path, '.vue')) {
                $test_path = substr($test_path, 0, -3);
            } else {
                $test_path = substr($test_path, 0, -2);
            }
            $test_path .= 'test.js';

            if (file_exists($test_path)) {
                unlink($test_path);
                echo 'Deleted ' . $test_path . PHP_EOL;
            }
        }
    }

    if (file_exists(FIELD_COMPONENT_PATH)) {
        $content = $allFileContents[FIELD_COMPONENT_PATH];
        ksort($usedFieldComponents);
        $imports = [];
        $map = [];

        foreach (array_filter(array_keys($usedFieldComponents), fn($component) => $usedFieldComponents[$component]) as $component_basename) {
            $component_name = substr($component_basename, 0, -4);

            if (!file_exists(__DIR__ . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR . 'components' . DIRECTORY_SEPARATOR . 'common' . DIRECTORY_SEPARATOR . 'form' . DIRECTORY_SEPARATOR . $component_basename)) {
                continue;
            }

            $imports[] = "import {$component_name} from './{$component_basename}'";

            foreach ($fieldComponentsByType as $component_alias => $component_basename_) {
                if ($component_basename === $component_basename_) {
                    $map[] = "    '{$component_alias}': {$component_name},";
                    break;
                }
            }
        }

        $importBlock = implode("\n", $imports);
        $mapBlock = 'const componentMap = {' . PHP_EOL . implode("\n", $map) . PHP_EOL . '}';

        if (strpos($content, IMPORT_PLACEHOLDER) !== false) {
            $content = str_replace(IMPORT_PLACEHOLDER, STATIC_CUSTOM_FIELD_IMPORT_OPEN . PHP_EOL . $importBlock . PHP_EOL . PHP_EOL . $mapBlock . PHP_EOL . STATIC_CUSTOM_FIELD_IMPORT_CLOSE, $content);
            file_put_contents(FIELD_COMPONENT_PATH, $content);
            echo "Field.vue updated with used components.\n";
        } else {
            echo "Field.vue could not be updated with used components.\n";
        }
    }
}

$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(__DIR__ . DIRECTORY_SEPARATOR . 'src'), RecursiveIteratorIterator::CHILD_FIRST);

foreach ($iterator as $path) {
    if (!$path->isDir()) continue;
    if (in_array(basename($path->getPathname()), [
        '.',
        '..',
    ])) continue;

    $filesInDir = scandir($path->getPathname());

    if ($filesInDir === ['.', '..']) {
        rmdir($path->getPathname());
        echo 'Deleted empty directory ' . $path->getPathname() . PHP_EOL;
    }
}
