cmake_minimum_required(VERSION 3.14)

project(rematch-web LANGUAGES CXX)

set(REmatch_ROOT ${PROJECT_SOURCE_DIR}/REmatch-js/REmatch)

# The output path for .wasm and .js files
# set(EXECUTABLE_OUTPUT_PATH "${PROJECT_SOURCE_DIR}")

# Set directories to include from REmatch
include_directories(SYSTEM ${REmatch_ROOT}/thirdparty)
include_directories(${REmatch_ROOT}/src)

# Call the CMakeLists.txt inside REmatch-js submodule
add_subdirectory(REmatch-js)
