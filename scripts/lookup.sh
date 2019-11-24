#!/bin/bash

# db.unit.aggregate([
#   {
#     $lookup: {
#       from: "topic",
#       localField: "_id",
#       foreignField: "unitId",
#       as: "topics"
#     }
#   }
# ]);