<?php

namespace App\Services;

class SoalParserService
{
    public function parse(string $rawText): array
    {
        $lines = explode("\n", str_replace("\r", "", $rawText));
        $blocks = [];
        $currentBlock = [];

        foreach ($lines as $line) {
            $trimmed = trim($line);
            if ($trimmed === '') {
                if (!empty($currentBlock)) {
                    $blocks[] = $currentBlock;
                    $currentBlock = [];
                }
            } else {
                $currentBlock[] = $trimmed;
            }
        }
        if (!empty($currentBlock)) {
            $blocks[] = $currentBlock;
        }

        $results = [];

        foreach ($blocks as $block) {
            $pertanyaan = '';
            $opsi = [];
            $jawabanHuruf = '';
            $pembahasan = '';
            $status = 'valid';
            $errorMessage = '';

            foreach ($block as $line) {
                if (preg_match('/^[A-E][\.\)]\s*(.*)/i', $line, $matches)) {
                    $huruf = strtoupper(substr($line, 0, 1));
                    $opsi[$huruf] = $matches[1];
                } elseif (preg_match('/^(jawaban|kunci):\s*([A-E])/i', $line, $matches)) {
                    $jawabanHuruf = strtoupper($matches[2]);
                } elseif (preg_match('/^pembahasan:\s*(.*)/i', $line, $matches)) {
                    $pembahasan = $matches[1];
                } else {
                    if (empty($opsi) && empty($jawabanHuruf) && empty($pembahasan)) {
                        $pertanyaan .= ($pertanyaan === '' ? '' : ' ') . $line;
                    } elseif (!empty($pembahasan)) {
                        $pembahasan .= ' ' . $line;
                    }
                }
            }

            $pertanyaan = preg_replace('/^\d+[\.\)]\s*/', '', $pertanyaan);

            if (empty($pertanyaan)) {
                $status = 'error';
                $errorMessage = 'Pertanyaan tidak ditemukan';
            } elseif (count($opsi) < 2) {
                $status = 'error';
                $errorMessage = 'Opsi pilihan ganda minimal 2 (A, B, ...)';
            } elseif (empty($jawabanHuruf)) {
                $status = 'error';
                $errorMessage = 'Jawaban benar belum ditentukan (contoh: Jawaban: B)';
            } elseif (!isset($opsi[$jawabanHuruf])) {
                $status = 'error';
                $errorMessage = 'Kunci jawaban (' . $jawabanHuruf . ') tidak cocok dengan opsi yang ada';
            }

            $formattedOpsi = [];
            foreach ($opsi as $huruf => $teks) {
                $formattedOpsi[] = [
                    'huruf' => $huruf,
                    'teks_opsi' => $teks,
                    'benar' => ($huruf === $jawabanHuruf),
                ];
            }

            $results[] = [
                'status' => $status,
                'error_message' => $errorMessage,
                'pertanyaan' => $pertanyaan,
                'jenis_soal' => 'pilihan_ganda',
                'pembahasan' => $pembahasan,
                'jawaban_benar' => $jawabanHuruf,
                'opsi' => $formattedOpsi,
            ];
        }

        return $results;
    }
}
