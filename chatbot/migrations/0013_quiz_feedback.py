# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2017-12-12 06:29
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chatbot', '0012_node_quiz'),
    ]

    operations = [
        migrations.AddField(
            model_name='quiz',
            name='feedback',
            field=models.TextField(default=''),
        ),
    ]
