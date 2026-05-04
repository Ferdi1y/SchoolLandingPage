<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Achievement;


class AchievementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $achievements = Achievement::all();
        return response()->json($achievements);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'photo' => 'nullable|image|max:2048',
            'level' => 'required|in:sekolah,kecamatan,kabupaten,provinsi,nasional,internasional',
            'category' => 'required|in:akademik,olahraga,seni,keagamaan,lainnya',
            'rank' => 'nullable|string|max:255',
            'participant_name' => 'nullable|string|max:255',
            'achievement_date' => 'required|date',
            'academic_year' => 'required|integer',
            'is_featured' => 'boolean'
        ]);

        $achievement = Achievement::create($validatedData);
        return response()->json($achievement, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $achievement = Achievement::findOrFail($id);
        return response()->json($achievement);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try{
            $achievement = Achievement::findOrFail($id);

            $validatedData = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'photo' => 'nullable|image|max:2048',
                'level' => 'sometimes|required|in:sekolah,kecamatan,kabupaten,provinsi,nasional,internasional',
                'category' => 'sometimes|required|in:akademik,olahraga,seni,keagamaan,lainnya',
                'rank' => 'nullable|string|max:255',
                'participant_name' => 'nullable|string|max:255',
                'achievement_date' => 'sometimes|required|date',
                'academic_year' => 'sometimes|required|integer',
                'is_featured' => 'boolean'
            ]);

            $achievement->update($validatedData);
            return response()->json($achievement);
        }catch(Exception $e){
            return response()->json(['error' => 'Failed to update achievement', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $achievement = Achievement::findOrFail($id);
            $achievement->delete();
            return response()->json(['message' => 'Achievement deleted successfully']);
        }catch(Exception $e){
            return response()->json(['error' => 'Failed to delete achievement', 'message' => $e->getMessage()], 500);
        }
    }
}
