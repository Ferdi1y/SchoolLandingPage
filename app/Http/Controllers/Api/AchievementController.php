<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class AchievementController extends Controller
{
    // GET /api/achievements
    public function index(Request $request)
    {
        $query = Achievement::query();

        // Filter berdasarkan level
        if ($request->has('level')) {
            $query->byLevel($request->level);
        }

        // Filter berdasarkan category
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        // Filter featured
        if ($request->has('featured') && $request->featured) {
            $query->featured();
        }

        // Filter berdasarkan tahun ajaran
        if ($request->has('academic_year')) {
            $query->where('academic_year', $request->academic_year);
        }

        // Search berdasarkan title atau participant_name
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('participant_name', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'achievement_date');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $achievements = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $achievements,
            'message' => 'Achievements retrieved successfully'
        ]);
    }

    // POST /api/achievements
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'level' => 'required|in:sekolah,kecamatan,kabupaten,provinsi,nasional,internasional',
            'category' => 'required|in:akademik,olahraga,seni,keagamaan, lainnya',
            'rank' => 'required|in:Juara 1,Juara 2,Juara 3,Harapan 1,Harapan 2,Finalis,Peserta Terbaik',
            'participant_name' => 'nullable|string|max:255',
            'achievement_date' => 'required|date',
            'academic_year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'is_featured' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
                'message' => 'Validation failed'
            ], 422);
        }

        $data = $request->all();

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('achievements', 'public');
            $data['photo'] = $photoPath;
        }

        $achievement = Achievement::create($data);

        return response()->json([
            'success' => true,
            'data' => $achievement,
            'message' => 'Achievement created successfully'
        ], 201);
    }

    // GET /api/achievements/{id}
    public function show($id)
    {
        $achievement = Achievement::find($id);

        if (!$achievement) {
            return response()->json([
                'success' => false,
                'message' => 'Achievement not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $achievement,
            'message' => 'Achievement retrieved successfully'
        ]);
    }

    // PUT /api/achievements/{id}
    public function update(Request $request, $id)
    {
        $achievement = Achievement::find($id);

        if (!$achievement) {
            return response()->json([
                'success' => false,
                'message' => 'Achievement not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'level' => 'sometimes|required|in:sekolah,kecamatan,kabupaten,provinsi,nasional,internasional',
            'category' => 'sometimes|required|in:akademik,olahraga,seni,keagamaan, lainnya',
            'rank' => 'sometimes|required|in:Juara 1,Juara 2,Juara 3,Harapan 1,Harapan 2,Finalis,Peserta Terbaik',
            'participant_name' => 'nullable|string|max:255',
            'achievement_date' => 'sometimes|required|date',
            'academic_year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'is_featured' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
                'message' => 'Validation failed'
            ], 422);
        }

        $data = $request->all();

        // Handle photo upload
        if ($request->hasFile('photo')) {
            // Delete old photo
            if ($achievement->photo && Storage::disk('public')->exists($achievement->photo)) {
                Storage::disk('public')->delete($achievement->photo);
            }
            
            $photoPath = $request->file('photo')->store('achievements', 'public');
            $data['photo'] = $photoPath;
        }

        $achievement->update($data);

        return response()->json([
            'success' => true,
            'data' => $achievement,
            'message' => 'Achievement updated successfully'
        ]);
    }

    // DELETE /api/achievements/{id}
    public function destroy($id)
    {
        $achievement = Achievement::find($id);

        if (!$achievement) {
            return response()->json([
                'success' => false,
                'message' => 'Achievement not found'
            ], 404);
        }

        // Delete photo if exists
        if ($achievement->photo && Storage::disk('public')->exists($achievement->photo)) {
            Storage::disk('public')->delete($achievement->photo);
        }

        $achievement->delete();

        return response()->json([
            'success' => true,
            'message' => 'Achievement deleted successfully'
        ]);
    }

    // GET /api/achievements/featured
    public function featured()
    {
        $achievements = Achievement::featured()
            ->orderBy('achievement_date', 'desc')
            ->take(6)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $achievements,
            'message' => 'Featured achievements retrieved successfully'
        ]);
    }

    // GET /api/achievements/statistics
    public function statistics()
    {
        $stats = [
            'total' => Achievement::count(),
            'by_level' => [
                'sekolah' => Achievement::byLevel('sekolah')->count(),
                'kecamatan' => Achievement::byLevel('kecamatan')->count(),
                'kabupaten' => Achievement::byLevel('kabupaten')->count(),
                'provinsi' => Achievement::byLevel('provinsi')->count(),
                'nasional' => Achievement::byLevel('nasional')->count(),
                'internasional' => Achievement::byLevel('internasional')->count(),
            ],
            'by_category' => [
                'akademik' => Achievement::byCategory('akademik')->count(),
                'olahraga' => Achievement::byCategory('olahraga')->count(),
                'seni' => Achievement::byCategory('seni')->count(),
                'keagamaan' => Achievement::byCategory('keagamaan')->count(),
                'lainnya' => Achievement::byCategory('lainnya')->count(),
            ],
            'featured_count' => Achievement::featured()->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
            'message' => 'Statistics retrieved successfully'
        ]);
    }
}